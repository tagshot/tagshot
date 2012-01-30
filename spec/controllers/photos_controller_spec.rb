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
            JSON(response.body).each do |photo|
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

          it 'should support or queries' do
            Factory(:photo_with_tags)
            Factory(:photo_with_f_tags)
            Factory(:photo_with_g_tags)

            get :index, :format => :json, :q => 'f,g'
            json = JSON(response.body)
            json.length.should == 2
            json.each do |photo|
              (photo['tags'] & ['f', 'g']).size.should > 0
            end
          end

          it 'should return a list of photos with a date before' do
            Factory(:photo).data.update_attributes!(:date => '2012-01-01')
            Factory(:photo).data.update_attributes!(:date => '2012-01-02')
            Factory(:photo).data.update_attributes!(:date => '2012-01-03')

            get :index, :format => :json, :q => 'date:<2012-01-02'
            json = JSON(response.body)
            json.length.should == 1
            json.each do |photo|
              photo['properties']['date'].should < '2012-01-02'
            end
          end

          it 'should return a list of photos with a date after' do
            Factory(:photo).data.update_attributes!(:date => '2012-01-01')
            Factory(:photo).data.update_attributes!(:date => '2012-01-02')
            Factory(:photo).data.update_attributes!(:date => '2012-01-03')

            get :index, :format => :json, :q => 'date:>2012-01-01'
            json = JSON(response.body)
            json.length.should == 2
            json.each do |photo|
              photo['properties']['date'].should > '2012-01-01'
            end
          end

          it 'should return a list of photos with a partial date before' do
            Factory(:photo)
            Factory(:photo)

            get :index, :format => :json, :q => 'date:<2012-01'
            json = JSON(response.body)
            json.length.should > 0
            json.each do |photo|
              photo['properties']['date'].should < '2012-01-01'
            end
          end

          it 'should return a list of photos with a partial date after' do
            Factory(:photo)
            Factory(:photo)
            Factory(:photo)
            Factory(:photo)

            get :index, :format => :json, :q => 'date:>2012'
            json = JSON(response.body)
            json.length.should > 0
            json.each do |photo|
              photo['properties']['date'].should > '2012-01-01'
            end
          end

          it 'should return a list of photos with specific stars' do
            Photo.count.should == 0
            Factory(:photo).data.update_attributes!(:rating => 2)
            Factory(:photo).data.update_attributes!(:rating => 3)
            Factory(:photo).data.update_attributes!(:rating => 4)

            get :index, :format => :json, :q => 'stars:3'
            json = JSON(response.body)
            json.length.should == 1
            json.each do |photo|
              photo['properties']['rating'].should == 3
            end
          end

          it 'should return a list of photos with more or equal stars' do
            Factory(:photo).data.update_attributes!(:rating => 2)
            Factory(:photo).data.update_attributes!(:rating => 3)
            Factory(:photo).data.update_attributes!(:rating => 4)

            get :index, :format => :json, :q => 'stars:>3'
            json = JSON(response.body)
            json.length.should == 2
            json.each do |photo|
              photo['properties']['rating'].should > 3
            end
          end

          it 'should return nothing for invalid rating ranges' do
            Factory(:photo)
            get :index, :format => :json, :q => 'stars:<3+stars:>3'
            JSON(response.body).length.should == 0
          end

          it 'should handle all matching rating range queries' do
            get :index, :format => :json, :q => 'stars:>=0'
            length = JSON(response.body).length
            get :index, :format => :json, :q => 'stars:<=5'
            JSON(response.body).length.should == length
          end

          it 'should return a list with photos from a given year' do
            Factory(:photo)
            get :index, :format => :json, :q => 'year:2010'

            JSON(response.body).each do |photo|
              Photo.find(photo[:id]).source.year.should == 2010
            end
            # need a way to check photo year
            #JSON(response.body).each do |photo|
            #  photo['year'].should == 2010
            #end
          end

          it 'should correct handle year range queries' do
            Factory(:photo_with_tags)
            get :index, :format => :json, :q => 'year:<2011+year:>2011'
            JSON(response.body).length.should == 0
            get :index, :format => :json, :q => 'year:>=2010'
            length = JSON(response.body).length
            get :index, :format => :json, :q => 'year:<=2012'
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
