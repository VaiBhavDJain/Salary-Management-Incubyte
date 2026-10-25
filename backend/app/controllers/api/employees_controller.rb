module Api
  class EmployeesController < ApplicationController
    before_action :set_employee, only: %i[show update destroy]

    def index
      pagination = Pagination.new(Employee.order(:full_name, :id), page: params[:page], per_page: params[:per_page])

      render json: {
        data: pagination.records.map { |employee| EmployeeSerializer.new(employee) },
        meta: pagination.meta
      }
    end

    def show
      render json: EmployeeSerializer.new(@employee)
    end

    def create
      @employee = Employee.new(employee_params)

      if @employee.save
        render json: EmployeeSerializer.new(@employee), status: :created
      else
        render_validation_errors
      end
    end

    def update
      if @employee.update(employee_params)
        render json: EmployeeSerializer.new(@employee)
      else
        render_validation_errors
      end
    end

    def destroy
      @employee.destroy!

      head :no_content
    end

    private

    def set_employee
      @employee = Employee.find(params[:id])
    end

    def employee_params
      params.expect(employee: %i[full_name email job_title department country_code salary])
    end

    def render_validation_errors
      render json: { errors: @employee.errors.to_hash }, status: :unprocessable_content
    end
  end
end
