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
    end
  end
  
  describe 'GET show' do
    context 'as JSON' do
      before(:all) { @photo = Factory(:photo) }
      
      it 'should respond with OK' do
        get :show, :format => :json, :id => @photo.id
        response.status.should == 200
      end
      
      it 'should return photo hash consutrcted by PhotoDecorator' do
        get :show, :format => :json, :id => @photo.id
        response.body.should == PhotoDecorator.decorate(@photo).to_json
      end
    end
  end
end
