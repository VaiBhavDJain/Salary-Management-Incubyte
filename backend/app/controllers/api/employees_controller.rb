module Api
  class EmployeesController < ApplicationController
    def index
      pagination = Pagination.new(Employee.order(:full_name, :id), page: params[:page], per_page: params[:per_page])

      render json: {
        data: pagination.records.map { |employee| EmployeeSerializer.new(employee) },
        meta: pagination.meta
      }
    end

    def show
      render json: EmployeeSerializer.new(Employee.find(params[:id]))
    end

    def create
      employee = Employee.new(employee_params)

      if employee.save
        render json: EmployeeSerializer.new(employee), status: :created
      else
        render json: { errors: employee.errors.to_hash }, status: :unprocessable_content
      end
    end

    private

    def employee_params
      params.expect(employee: %i[full_name email job_title department country_code salary])
    end
  end
end
