Tagshot::Application.routes.draw do
  
  resources :photos, :only => [:index, :update, :show]
  resources :tags,   :only => [:index]
  
  root :to => 'photos#index'
end
