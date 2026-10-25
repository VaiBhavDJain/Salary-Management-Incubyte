module Api
  class EmployeesController < ApplicationController
    def index
      employees = Employee.order(:full_name, :id)

      render json: { data: employees.map { |employee| EmployeeSerializer.new(employee) } }
    end
  end
end
