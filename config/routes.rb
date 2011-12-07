Tagshot::Application.routes.draw do

  resources :photos, :only => [:index, :update, :show]
  get 'photos/thumb/:id(.:format)' => 'photos#thumb', :as => :thumb
  get 'photos/:id/download/:width(/:height)(/:crop)/:filename.:format' => 'photos#download', :as => :download,
        :constraints => {
          :width => /\d+/,
          :height => /\d+/,
          :crop => "crop",
          :filename => /\d+(_\d+(x\d+)?)?(_croped|_streched)?(_[A-z0-9-]+)?/
        }
  resources :tags, :only => [:index]

  root :to => 'photos#index'
end

