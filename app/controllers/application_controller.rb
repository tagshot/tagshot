class ApplicationController < ActionController::Base
  protect_from_forgery
  
  before_filter :setup_user
  
  if Rails.env.production?
    rescue_from ActiveRecord::RecordNotFound, :with => :error_not_found
    rescue_from StandardError, :with => :render_error 
  end
  
  def setup_user
    User.current = find_current_user
    Rails.logger.warn "WARN: Logged in as #{User.current.login}!"
  end
  
  def find_current_user
    user = User.find_by_id(session[:user_id])
    return user if user && user.logged?
    
    authenticate_with_http_basic do |username, password|
      return User.authenticate(username, password)
    end
  end
  
  def require_authentication
    unless User.current.logged?
      flash[:error] = 'Authentication required.'
      redirect_to (url_for new_session_url).gsub('http://', Rails.env == 'production' ?  'https://' : 'http://')
      false
    end
  end

  def current_user=(user)
    reset_session
    if user && user.is_a?(User) && user.logged?
      User.current = user
      session[:user_id] = user.id
    else
      User.current = nil
    end
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
