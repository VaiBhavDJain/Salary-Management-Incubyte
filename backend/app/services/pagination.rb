class Pagination
  DEFAULT_PER_PAGE = 25
  MAX_PER_PAGE = 100

  attr_reader :page, :per_page

  def initialize(scope, page: nil, per_page: nil)
    @scope = scope
    @page = positive_or(page, 1)
    @per_page = [ positive_or(per_page, DEFAULT_PER_PAGE), MAX_PER_PAGE ].min
  end

  def records
    @scope.limit(per_page).offset((page - 1) * per_page)
  end

  def meta
    { page:, per_page:, total_count:, total_pages: (total_count.to_f / per_page).ceil }
  end

  private

  def total_count
    @total_count ||= @scope.count
  end

  def positive_or(value, fallback)
    number = value.to_i
    number.positive? ? number : fallback
  end
end
