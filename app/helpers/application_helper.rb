module ApplicationHelper
  def mustache_templates
    Dir[Rails.root.join(*%w{app views mustache *})].map do |file|
      id      = File.basename(file).gsub(/\..*$/, '')
      content = (render :file => file).gsub(/\s+/, ' ')
      
      "<script id=\"##{id}-template\" type=\"text/x-mustache\">#{content}</script>"
    end.join("\n").html_safe
  end
end
