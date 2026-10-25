class FrontendController < ApplicationController
  class_attribute :index_path, default: Rails.public_path.join("spa/index.html")

  def show
    return head(:not_found) unless File.exist?(index_path)

    response.headers["Cache-Control"] = "no-cache"
    send_file index_path, type: "text/html", disposition: "inline"
  end
end
