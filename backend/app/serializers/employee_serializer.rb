class EmployeeSerializer
  def initialize(employee)
    @employee = employee
  end

  def as_json(*)
    {
      id: @employee.id,
      full_name: @employee.full_name,
      email: @employee.email,
      job_title: @employee.job_title,
      department: @employee.department,
      country_code: @employee.country_code,
      currency: @employee.currency,
      salary: @employee.salary.to_f
    }
  end
end
