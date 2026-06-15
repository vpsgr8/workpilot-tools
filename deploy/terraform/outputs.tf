output "cloud_run_url" {
  description = "BizBuilt API URL — set as BIZBUILT_CONFIG.apiUrl"
  value       = google_cloud_run_v2_service.bizbuilt_api.uri
}

output "cloud_sql_connection" {
  description = "Cloud SQL connection name"
  value       = google_sql_database_instance.bizbuilt.connection_name
}

output "database_name" {
  value = google_sql_database.bizbuilt.name
}
