class EmployeeQuery
  FILTERS = %i[country_code department job_title].freeze

  def initialize(params = {})
    @params = params
  end

  def call
    scope = Employee.order(:full_name, :id)
    scope = search(scope)
    filter(scope)
  end

  private

  def search(scope)
    term = @params[:q].to_s.strip
    return scope if term.empty?

    pattern = "%#{Employee.sanitize_sql_like(term)}%"
    scope.where("full_name ILIKE :pattern OR email ILIKE :pattern", pattern:)
  end

  def filter(scope)
    conditions = FILTERS.index_with { |key| @params[key].to_s.squish.presence }.compact
    scope.where(conditions)
  end
end
