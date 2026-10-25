Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :employees, only: %i[index show create update destroy]
    resource :filter_options, only: :show

    namespace :insights do
      resource :overview, only: :show
      resources :countries, only: :show, param: :code
    end
  end

  root "frontend#show"
  get "*path", to: "frontend#show", constraints: ->(request) { !request.path.start_with?("/api/") && request.format.html? }
end
