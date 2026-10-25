class PayInsights
  def initialize(scope)
    @scope = scope
  end

  def summary
    headcount, min, max, average, median = @scope.pick(
      Arel.sql("COUNT(*)"),
      Arel.sql("MIN(salary)"),
      Arel.sql("MAX(salary)"),
      Arel.sql("AVG(salary)"),
      Arel.sql("PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)")
    )

    {
      headcount:,
      min_salary: amount(min),
      max_salary: amount(max),
      average_salary: amount(average),
      median_salary: amount(median)
    }
  end

  private

  def amount(value)
    value&.to_f&.round(2)
  end
end
