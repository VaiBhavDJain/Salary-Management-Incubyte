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

  def breakdown_by(column)
    rows = @scope.group(column).order(Arel.sql("AVG(salary) DESC"), column).pluck(
      column,
      Arel.sql("COUNT(*)"),
      Arel.sql("MIN(salary)"),
      Arel.sql("MAX(salary)"),
      Arel.sql("AVG(salary)"),
      Arel.sql("PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)")
    )

    rows.map do |group, headcount, min, max, average, median|
      {
        column => group,
        headcount:,
        min_salary: amount(min),
        max_salary: amount(max),
        average_salary: amount(average),
        median_salary: amount(median)
      }
    end
  end

  private

  def amount(value)
    value&.to_f&.round(2)
  end
end
