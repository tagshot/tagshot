Tagshot::Application.routes.draw do
  
  resources :photos, :only => [:index, :update, :show]
  get 'photos/:id(.:format)' => 'photos#thumb', :as => :thumb
  resources :tags,   :only => [:index]
  
  root :to => 'photos#index'
end
