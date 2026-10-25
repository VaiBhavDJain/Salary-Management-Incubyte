module Api
  module Insights
    class CountriesController < ApplicationController
      def show
        country = Country.find(params[:code])
        return render json: { error: "Country not found" }, status: :not_found unless country

        insights = PayInsights.new(Employee.where(country_code: country.code))

        render json: {
          country: country.to_h,
          summary: insights.summary,
          job_titles: insights.breakdown_by(:job_title)
        }
      end
    end
  end
end
