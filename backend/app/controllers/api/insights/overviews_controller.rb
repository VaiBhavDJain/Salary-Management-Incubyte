module Api
  module Insights
    class OverviewsController < ApplicationController
      def show
        render json: OrgOverview.new.call
      end
    end
  end
end
