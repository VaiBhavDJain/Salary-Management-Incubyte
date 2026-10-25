module Api
  class EmployeesController < ApplicationController
    def index
      pagination = Pagination.new(Employee.order(:full_name, :id), page: params[:page], per_page: params[:per_page])

      render json: {
        data: pagination.records.map { |employee| EmployeeSerializer.new(employee) },
        meta: pagination.meta
      }
    end
  end
end
