terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_sql_database_instance" "bizbuilt" {
  name             = "bizbuilt-db"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = var.db_tier
    backup_configuration {
      enabled                        = true
      point_in_time_recovery_enabled = true
    }
    ip_configuration {
      ipv4_enabled = true
    }
  }

  deletion_protection = false
}

resource "google_sql_database" "bizbuilt" {
  name     = var.db_name
  instance = google_sql_database_instance.bizbuilt.name
}

resource "google_sql_user" "bizbuilt" {
  name     = var.db_user
  instance = google_sql_database_instance.bizbuilt.name
  password = random_password.db_password.result
}

resource "random_password" "db_password" {
  length  = 24
  special = true
}

resource "google_secret_manager_secret" "db_url" {
  secret_id = "bizbuilt-database-url"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_url" {
  secret      = google_secret_manager_secret.db_url.id
  secret_data = "postgresql://${var.db_user}:${random_password.db_password.result}@/${var.db_name}?host=/cloudsql/${google_sql_database_instance.bizbuilt.connection_name}"
}

resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "bizbuilt-jwt-secret"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "jwt_secret" {
  secret      = google_secret_manager_secret.jwt_secret.id
  secret_data = random_password.jwt_secret.result
}

resource "random_password" "jwt_secret" {
  length  = 48
  special = false
}

# Cloud Run service — deploy container image after building server/Dockerfile
resource "google_cloud_run_v2_service" "bizbuilt_api" {
  name     = var.service_name
  location = var.region

  template {
    containers {
      image = "gcr.io/${var.project_id}/bizbuilt-api:latest"

      env {
        name  = "COMPANY_NAME"
        value = var.company_name
      }
      env {
        name  = "ALLOWED_DOMAIN"
        value = var.allowed_domain
      }
      env {
        name  = "LICENSE_TIER"
        value = var.license_tier
      }
      env {
        name  = "MAX_EMPLOYEES"
        value = tostring(var.max_employees)
      }
      env {
        name  = "DATABASE_SSL"
        value = "true"
      }

      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_url.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "JWT_SECRET"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.jwt_secret.secret_id
            version = "latest"
          }
        }
      }

      volume_mounts {
        name       = "cloudsql"
        mount_path = "/cloudsql"
      }
    }

    volumes {
      name = "cloudsql"
      cloud_sql_instance {
        instances = [google_sql_database_instance.bizbuilt.connection_name]
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 4
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }
}

resource "google_cloud_run_service_iam_member" "public" {
  location = google_cloud_run_v2_service.bizbuilt_api.location
  service  = google_cloud_run_v2_service.bizbuilt_api.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
