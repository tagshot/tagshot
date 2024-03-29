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
        before(:each) { set_current_user FactoryGirl.create(:user) }

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
        before(:each) { set_current_user FactoryGirl.create(:user) }

        it 'should respond with OK' do
          get :index, :format => :json
          response.status.should == 200
        end

        it 'should return list of photos' do
          get :index, :format => :json
          JSON(response.body).should be_an(Array)
        end

        it 'should not return more than 100 photos' do
          150.times { FactoryGirl.create(:photo) }
          get :index, :format => :json

          Photo.all.count.should > 100 # ensure there are more than 100 photos
          JSON(response.body).length.should == 100
        end

        it 'should order photos by date' do
          FactoryGirl.create(:photo).photo_data.update_attributes date: DateTime.new(2011, 12, 31, 12, 33, 45)
          FactoryGirl.create(:photo).photo_data.update_attributes date: DateTime.new(2011, 12, 30, 12, 33, 45)
          FactoryGirl.create(:photo).photo_data.update_attributes date: DateTime.new(2011, 12, 30, 12, 34, 45)

          get :index, :format => :json

          j = JSON(response.body)
          j.should have(3).items
          j[0]['meta']['date'].should == "2011-12-31T12:33:45Z"
          j[1]['meta']['date'].should == "2011-12-30T12:34:45Z"
          j[2]['meta']['date'].should == "2011-12-30T12:33:45Z"
        end

        it 'should return photos without photo data' do
          FactoryGirl.create(:photo).photo_data.update_attributes date: DateTime.new(2011, 12, 31, 12, 33, 45)
          FactoryGirl.create(:photo).photo_data.destroy.should be_destroyed

          get :index, :format => :json

          JSON(response.body).should have(2).items
        end

        context 'with query' do
          it 'should search for photos with all given tags' do
            FactoryGirl.create(:photo_with_tags)
            FactoryGirl.create(:photo_with_more_tags)

            get :index, :format => :json, :q => 'a+e'
            JSON(response.body).each do |photo|
              photo['tags'].include?('a').should == true
              photo['tags'].include?('e').should == true
            end
          end

          it 'should return the default list for an empty search' do
            FactoryGirl.create(:photo_with_tags)
            FactoryGirl.create(:photo_with_more_tags)

            get :index, :format => :json, :q => ''
            JSON(response.body).length.should > 0
          end

          it 'should support or queries' do
            FactoryGirl.create(:photo_with_tags)
            FactoryGirl.create(:photo_with_f_tags)
            FactoryGirl.create(:photo_with_g_tags)

            get :index, :format => :json, :q => 'f,g'
            json = JSON(response.body)
            json.length.should == 2
            json.each do |photo|
              (photo['tags'] & ['f', 'g']).size.should > 0
            end
          end

          it 'should return a list of photos with a date before' do
            FactoryGirl.create(:photo).data.update_attributes!(:date => '2012-01-01')
            FactoryGirl.create(:photo).data.update_attributes!(:date => '2012-01-02')
            FactoryGirl.create(:photo).data.update_attributes!(:date => '2012-01-03')

            get :index, :format => :json, :q => 'date:<2012-01-02'
            json = JSON(response.body)
            json.length.should == 1
            json.each do |photo|
              photo['meta']['date'].should < '2012-01-02'
            end
          end

          it 'should return a list of photos with a date after' do
            FactoryGirl.create(:photo).data.update_attributes!(:date => '2012-01-01')
            FactoryGirl.create(:photo).data.update_attributes!(:date => '2012-01-02')
            FactoryGirl.create(:photo).data.update_attributes!(:date => '2012-01-03')

            get :index, :format => :json, :q => 'date:>2012-01-01'
            json = JSON(response.body)
            json.length.should == 2
            json.each do |photo|
              photo['meta']['date'].should > '2012-01-01'
            end
          end

          it 'should return a list of photos with a partial date before' do
            FactoryGirl.create(:photo).data.update_attributes!(:date => '2011-12-31')
            FactoryGirl.create(:photo).data.update_attributes!(:date => '2012-01-01')
            FactoryGirl.create(:photo).data.update_attributes!(:date => '2012-02-03')

            get :index, :format => :json, :q => 'date:<2012-01'
            json = JSON(response.body)
            json.length.should > 0
            json.each do |photo|
              photo['meta']['date'].should < '2012-01-01'
            end
          end

          it 'should return a list of photos with a partial date after' do
            FactoryGirl.create(:photo)
            FactoryGirl.create(:photo)
            FactoryGirl.create(:photo)
            FactoryGirl.create(:photo)

            get :index, :format => :json, :q => 'date:>2012'
            json = JSON(response.body)
            json.length.should > 0
            json.each do |photo|
              photo['meta']['date'].should > '2012-01-01'
            end
          end

          it 'should return a list of photos with specific stars' do
            Photo.count.should == 0
            FactoryGirl.create(:photo).data.update_attributes!(:rating => 2)
            FactoryGirl.create(:photo).data.update_attributes!(:rating => 3)
            FactoryGirl.create(:photo).data.update_attributes!(:rating => 4)

            get :index, :format => :json, :q => 'stars:3'
            json = JSON(response.body)
            json.length.should == 1
            json.each do |photo|
              photo['properties']['rating'].should == 3
            end
          end

          it 'should return a list of photos with more or equal stars' do
            FactoryGirl.create(:photo).data.update_attributes!(:rating => 2)
            FactoryGirl.create(:photo).data.update_attributes!(:rating => 3)
            FactoryGirl.create(:photo).data.update_attributes!(:rating => 4)

            get :index, :format => :json, :q => 'stars:>3'
            json = JSON(response.body)
            json.length.should == 1
            json.each do |photo|
              photo['properties']['rating'].should > 3
            end
          end

          it 'should return nothing for invalid rating ranges' do
            FactoryGirl.create(:photo)
            get :index, :format => :json, :q => 'stars:<3+stars:>3'
            JSON(response.body).length.should == 0
          end

          it 'should handle all matching rating range queries' do
            FactoryGirl.create(:photo).data.update_attributes!(:rating => 2)
            FactoryGirl.create(:photo).data.update_attributes!(:rating => 5)
            get :index, :format => :json, :q => 'stars:>=0'
            length = JSON(response.body).length
            get :index, :format => :json, :q => 'stars:<=5'
            JSON(response.body).length.should == length
          end

          it 'should return a list with photos from a given year' do
            FactoryGirl.create(:photo).source.update_attributes!(:year => 2010)
            FactoryGirl.create(:photo).source.update_attributes!(:year => 2011)

            get :index, :format => :json, :q => 'year:2010'
            json = JSON(response.body)
            json.length.should == 1
            json.each do |photo|
              Photo.find(photo['id']).source.year.should == 2010
            end
          end

          it 'should correct handle year range queries' do
            FactoryGirl.create(:photo_with_tags)
            get :index, :format => :json, :q => 'year:<2011+year:>2011'
            JSON(response.body).length.should == 0
            get :index, :format => :json, :q => 'year:>=2010'
            length = JSON(response.body).length
            get :index, :format => :json, :q => 'year:<=2012'
            JSON(response.body).length.should == length
          end

	        it 'should return only photos of the given source' do
            source1 = FactoryGirl.create(:source)
            source2 = FactoryGirl.create(:source)
            source3 = FactoryGirl.create(:source)
            source4 = FactoryGirl.create(:source)
            photo1 = FactoryGirl.create(:photo, :source => source1)
            photo2 = FactoryGirl.create(:photo, :source => source2)
            photo3 = FactoryGirl.create(:photo, :source => source3)
            photo4 = FactoryGirl.create(:photo, :file => 'asdfasdf', :source => source1)

            get :index, :format => :json, :q => "source:#{source1.id}|#{source2.id}|#{source4.id}"

            JSON(response.body).map { |p| p['id'] }.should =~ [1,2,4]
          end
        end
      end
    end
  end

  describe 'GET show' do
    context 'as JSON' do
      before(:all) { @photo = FactoryGirl.create(:photo) }

      it 'should require authentication' do
        get :index
        response.status.should == 302
      end

      context 'with authenticated user' do
        before(:each) { set_current_user FactoryGirl.create(:user) }

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
      before(:all) { @photo = FactoryGirl.create(:photo) }

      it 'should require authentication' do
        get :index
        response.status.should == 302
      end

      context 'with authenticated user' do
        before(:each) { set_current_user FactoryGirl.create(:user) }

        it 'should respond to correct file extension' do
          get :show, :format => 'jpg', :id => @photo.id
          response.status.should == 200
        end

        it 'should respond to correct upcased file extension' do
          get :show, :format => 'JPG', :id => @photo.id
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

        it 'should respond with correct image file (2)' do
          get :show, :format => 'JPG', :id => @photo.id
          response.body.length.should == File.size(@photo.file)
        end
      end
    end
  end

  describe "GET thumb" do
    let(:photo) { FactoryGirl.create(:photo) }

    it 'should require authentication' do
      get :index
      response.status.should == 302
    end

    context 'with authenticated user' do
      before(:each) { set_current_user FactoryGirl.create(:user) }

      it 'should respond with OK' do
        put :update, :format => 'jpg', :id => photo.id
        response.status.should == 200
      end

      it 'should respond with OK (2)' do
        put :update, :format => 'JPG', :id => photo.id
        response.status.should == 200
      end
    end
  end

  describe 'PUT update' do
    context 'as JSON' do
      let(:photo) { FactoryGirl.create(:photo_with_tags) }

      it 'should require authentication' do
        get :index
        response.status.should == 302
      end

      context 'with authenticated user' do
        before(:each) { set_current_user FactoryGirl.create(:user) }

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
