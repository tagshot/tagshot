class AdminController < ApplicationController
  before_filter :require_authentication, :require_admin

  def require_admin
    unless User.current.admin?
      if params[:format].nil? or params[:format].to_s.downcase == 'html'
        self.current_user = nil
        redirect_to new_session_url, alert: 'Authorization required.'
      else
        render_401
      end
      false
    end
  end

  def index

  end
end