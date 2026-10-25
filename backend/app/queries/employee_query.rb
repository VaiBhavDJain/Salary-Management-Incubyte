class EmployeeQuery
  def initialize(params = {})
    @params = params
  end

  def call
    search(Employee.order(:full_name, :id))
  end

  private

  def search(scope)
    term = @params[:q].to_s.strip
    return scope if term.empty?

    pattern = "%#{Employee.sanitize_sql_like(term)}%"
    scope.where("full_name ILIKE :pattern OR email ILIKE :pattern", pattern:)
  end
end
