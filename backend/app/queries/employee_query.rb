class EmployeeQuery
  FILTERS = %i[country_code department job_title].freeze
  SORTABLE_COLUMNS = %w[full_name salary].freeze

  def initialize(params = {})
    @params = params
  end

  def call
    scope = search(Employee.all)
    scope = filter(scope)
    sort(scope)
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

  def sort(scope)
    column = SORTABLE_COLUMNS.include?(@params[:sort]) ? @params[:sort] : "full_name"
    direction = @params[:direction] == "desc" ? :desc : :asc
    scope.order(column => direction).order(:id)
  end
end
