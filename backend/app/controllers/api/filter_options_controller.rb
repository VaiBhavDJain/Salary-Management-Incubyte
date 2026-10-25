module Api
  class FilterOptionsController < ApplicationController
    def show
      render json: {
        countries: Country.all.sort_by(&:name).map(&:to_h),
        departments: Employee.distinct.order(:department).pluck(:department),
        job_titles: Employee.distinct.order(:job_title).pluck(:job_title)
      }
    end
  end
end
