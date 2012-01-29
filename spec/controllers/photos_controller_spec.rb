require 'spec_helper'

describe PhotosController do
  before(:each) { set_current_user User.anonymous }
  
  describe 'GET index' do
    context 'as HTML' do
      it 'should require authentication' do
        get :index
        response.status.should == 302
      end
      
      context 'with authenticated user' do
        before(:each) { set_current_user Factory(:user) }
        
        it 'should respond with OK' do
          get :index
          response.status.should == 200
        end
      end
    end
    
    context 'as JSON' do
      it 'should require authentication' do
        get :index
        response.status.should == 302
      end
      
      context 'with authenticated user' do
        before(:each) { set_current_user Factory(:user) }
        
        it 'should respond with OK' do
          get :index, :format => :json
          response.status.should == 200
        end
        
        it 'should return list of photos' do
          get :index, :format => :json
          JSON(response.body).should be_an(Array)
        end
        
        it 'should not return more than 100 photos' do
          150.times { Factory(:photo) }
          get :index, :format => :json
          
          Photo.all.count.should > 100 # ensure there are more than 100 photos
          JSON(response.body).length.should == 100
        end
        
        context 'with query' do
          it 'should search for photos with all given tags' do
            Factory(:photo_with_tags)
            Factory(:photo_with_more_tags)
            get :index, :format => :json, :q => 'a+e'
            
            json = JSON(response.body)
            json.each do |photo|
              photo['tags'].include?('a').should == true
              photo['tags'].include?('e').should == true
            end
          end
          it 'should return the default list for an empty search' do
            Factory(:photo_with_tags)
            Factory(:photo_with_more_tags)
            get :index, :format => :json, :q => ''
            JSON(response.body).length.should > 0
          end
          it 'should return a list of photos with a date before' do
            Factory(:photo_with_tags)
            get :index, :format => :json, :q => 'before:2012-01-02'
            json = JSON(response.body)
            json.each do |photo|
              photo['properties']['date'].should < '2012-01-02'
            end
          end
          it 'should return a list of photos with a date after' do
            Factory(:photo_with_tags)
            get :index, :format => :json, :q => 'after:2012-01-02'
            json = JSON(response.body)
            json.each do |photo|
              photo['properties']['date'].should > '2012-01-02'
            end
          end
          it 'should return a list of photos with a special rating' do
            Factory(:photo_with_tags)
            get :index, :format => :json, :q => 'stars:3'
            JSON(response.body).each do |photo|
              photo['properties']['rating'].should == 3
            end
            get :index, :format => :json, :q => 'stars:>3'
            JSON(response.body).each do |photo|
              photo['properties']['rating'].should > 3
            end
          end
          it 'should correct handle rating range queries' do
            Factory(:photo_with_tags)
            get :index, :format => :json, :q => 'stars:<3+stars:>3'
            JSON(response.body).length.should == 0
            get :index, :format => :json, :q => 'stars:>=0'
            length = JSON(response.body).length
            get :index, :format => :json, :q => 'stars:<=5'
            JSON(response.body).length.should == length
          end
        end
      end
    end
  end
  
  describe 'GET show' do
    context 'as JSON' do
      before(:all) { @photo = Factory(:photo) }
      
      it 'should require authentication' do
        get :index
        response.status.should == 302
      end
      
      context 'with authenticated user' do
        before(:each) { set_current_user Factory(:user) }
        
        it 'should respond with OK' do
          get :show, :format => :json, :id => @photo.id
          response.status.should == 200
        end
        
        it 'should return photo hash constructed by PhotoDecorator' do
          get :show, :format => :json, :id => @photo.id
          response.body.should == PhotoDecorator.decorate(@photo).to_json
        end
      end
    end
    
    context 'as file' do
      before(:all) { @photo = Factory(:photo) }
      
      it 'should require authentication' do
        get :index
        response.status.should == 302
      end
      
      context 'with authenticated user' do
        before(:each) { set_current_user Factory(:user) }
      
        it 'should respond to correct file extension' do
          get :show, :format => 'jpg', :id => @photo.id
          response.status.should == 200
        end
        
        it 'should not respond to incorrect file extension' do
          get :show, :format => 'html', :id => @photo.id
          response.status.should == 406
        end
        
        it 'should respond with correct image file' do
          get :show, :format => 'jpg', :id => @photo.id
          response.body.length.should == File.size(@photo.file)
        end
      end
    end
  end
  
  describe 'PUT update' do
    context 'as JSON' do
      let(:photo) { Factory(:photo_with_tags) }
      
      it 'should require authentication' do
        get :index
        response.status.should == 302
      end
      
      context 'with authenticated user' do
        before(:each) { set_current_user Factory(:user) }
      
        it 'should respond with OK' do
          put :update, :format => :json, :id => photo.id
          response.status.should == 200
        end
        
        it 'should return photo hash' do
          put :update, :format => :json, :id => photo.id
          response.body.should == PhotoDecorator.decorate(photo).to_json
        end
        
        it 'should do not update photo tags if nil given' do
          tags = photo.tag_names
          put :update, :format => :json, :id => photo.id, :photo => {:tags => nil}
          response.status.should == 200
          photo.tag_names.should == tags
        end
        
        it 'should do not update photo tags if no array given (1)' do
          tags = photo.tag_names
          put :update, :format => :json, :id => photo.id, :photo => {:tags => "abc"}
          response.status.should == 200
          photo.tag_names.should == tags
        end
        
        it 'should do remove all tags if empty array is given' do
          put :update, :format => :json, :id => photo.id, :photo => {:tags => []}
          response.status.should == 200
          photo.tag_names.should == []
        end
        
        it 'should do update photo tags' do
          put :update, :format => :json, :id => photo.id, :photo => {:tags => ['abc', 'cde', 'efg', 'hij']}
          response.status.should == 200
          photo.tag_names.should == ['abc', 'cde', 'efg', 'hij']
        end
        
        it 'should not update properties if nil given' do
          put :update, :format => :json, :id => photo.id, :photo => { :properties => nil }
          response.status.should == 200
          
          photo.photo_data(true).caption.should == 'Caption'
          photo.photo_data(true).rating.should >= 0
          photo.photo_data(true).rating.should <= 5
        end
        
        it 'should update photo properties' do
          put :update, :format => :json, :id => photo.id, :photo => 
              { :properties => {:caption => 'Bla', :description => 'Blub', :rating => 5}}
              
          response.status.should == 200
          
          photo.photo_data(true).caption.should == 'Bla'
          photo.photo_data(true).description.should == 'Blub'
          photo.photo_data(true).rating.should == 5
        end
      end
    end
  end
end
