class PayInsights
  FIGURES = [
    "COUNT(*)",
    "MIN(salary)",
    "MAX(salary)",
    "AVG(salary)",
    "PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)"
  ].map { |sql| Arel.sql(sql) }.freeze

  def initialize(scope)
    @scope = scope
  end

  def summary
    figures(@scope.pick(*FIGURES))
  end

  def breakdown_by(column)
    @scope.group(column)
          .order(Arel.sql("AVG(salary) DESC"), column)
          .pluck(column, *FIGURES)
          .map { |group, *row| { column => group, **figures(row) } }
  end

  private

  def figures(row)
    headcount, min, max, average, median = row

    {
      headcount:,
      min_salary: amount(min),
      max_salary: amount(max),
      average_salary: amount(average),
      median_salary: amount(median)
    }
  end

  def amount(value)
    value&.to_f&.round(2)
  end
end
