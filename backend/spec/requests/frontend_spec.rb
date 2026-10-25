require "rails_helper"

RSpec.describe "Frontend", type: :request do
  let(:html) { { "Accept" => "text/html" } }

  around do |example|
    original = FrontendController.index_path
    example.run
  ensure
    FrontendController.index_path = original
  end

  it "reads the built app from public/spa by default" do
    expect(FrontendController.index_path).to eq(Rails.public_path.join("spa/index.html"))
  end

  it "returns not found when the frontend has not been built" do
    FrontendController.index_path = Rails.root.join("tmp/missing/index.html")

    get "/", headers: html

    expect(response).to have_http_status(:not_found)
  end

  context "when the frontend is built" do
    before { FrontendController.index_path = file_fixture("frontend_index.html") }

    it "serves the app at the root without letting browsers cache it" do
      get "/", headers: html

      expect(response).to have_http_status(:ok)
      expect(response.media_type).to eq("text/html")
      expect(response.body).to include('<div id="root"></div>')
      expect(response.headers["Cache-Control"]).to eq("no-cache")
    end

    it "serves the app for client-side routes so links and refreshes work" do
      get "/insights/IN", headers: html

      expect(response).to have_http_status(:ok)
      expect(response.body).to include('<div id="root"></div>')
    end

    it "leaves unknown API paths to the API" do
      get "/api/unknown", headers: html

      expect(response).to have_http_status(:not_found)
      expect(response.body).not_to include('<div id="root"></div>')
    end
  end
end
