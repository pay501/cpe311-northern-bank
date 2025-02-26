package repositories

var select_transactions = "select * from transaction where id = ($1);"
var select_users = "select id, first_name, role, email from users;"
