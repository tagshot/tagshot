class SourcesController < ApplicationController
  before_filter :require_authentication
  respond_to :json

  def index
    respond_with Source.all()
  end
end
