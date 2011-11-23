require 'spec_helper'

describe PhotosController do
  describe 'GET index' do
    context 'as HTML' do
      it 'should respond with OK' do
        get :index
        response.status.should == 200
      end
    end
    
    context 'as JSON' do
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
    end
  end
  
  describe 'GET show' do
    context 'as JSON' do
      before(:all) { @photo = Factory(:photo) }
      
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
  
  describe 'PUT update' do
    context 'as JSON' do
      let(:photo) { Factory(:photo_with_tags) }
      
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
      
      it 'should do update photo tags' do
        put :update, :format => :json, :id => photo.id, :photo => {:tags => ['abc', 'cde', 'efg', 'hij']}
        response.status.should == 200
        photo.tag_names.should == ['abc', 'cde', 'efg', 'hij']
      end
    end
  end
end
