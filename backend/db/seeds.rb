if Employee.exists?
  puts "Employees already exist, skipping. Run bin/rails db:seed:replant to start fresh."
else
  count = Seeds::EmployeeSeeder.new(count: 10_000).call
  puts "Seeded #{count} employees."
end
