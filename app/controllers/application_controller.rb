class ApplicationController < ActionController::Base
  protect_from_forgery
  
  if Rails.env.production?
    rescue_from ActiveRecord::RecordNotFound, :with => :error_not_found
    rescue_from StandardError, :with => :render_error 
  end
  
  def error_access_denied; render_401 end
  def error_not_found; render_404 end
    
  def render_404(options={})
    render_error({:status => :not_found}.merge(options))
    return true
  end
  
  def render_401(options={})
    render_error({:status => :unauthorized}.merge(options))
    return true
  end
  
  def render_error(arg)
    arg = { :message => arg } unless arg.is_a?(Hash)
    arg[:layout] = 'application' if arg[:layout].nil?

    @status = arg[:status] || :internal_server_error
    @body = @status.to_s.gsub(/_/, ' ').capitalize

    respond_to do |format|
      format.html { render :text => @body, :layout => false, :status => @status }
      format.atom { head @status }
      format.xml  { head @status }
      format.js   { head @status }
      format.json { head @status }
    end
  end
end
