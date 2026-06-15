variable "project_id" {
  description = "Customer GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region (use asia-south1 for India)"
  type        = string
  default     = "asia-south1"
}

variable "service_name" {
  description = "Cloud Run service name"
  type        = string
  default     = "bizbuilt-api"
}

variable "db_tier" {
  description = "Cloud SQL machine tier"
  type        = string
  default     = "db-f1-micro"
}

variable "db_name" {
  type    = string
  default = "bizbuilt"
}

variable "db_user" {
  type    = string
  default = "bizbuilt"
}

variable "company_name" {
  type = string
}

variable "allowed_domain" {
  description = "Email domain restriction for Google Sign-In"
  type        = string
  default     = ""
}

variable "license_tier" {
  type    = string
  default = "starter"
}

variable "max_employees" {
  type    = number
  default = 10
}
