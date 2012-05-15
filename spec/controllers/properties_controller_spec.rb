require 'spec_helper'

describe PropertiesController do

  describe "GET index" do
    context "as JSON" do
      before(:each) { @photo = FactoryGirl.create(:photo_with_properties) }

      it 'should require authentication' do
        get :index, format: :json, photo_id: @photo.id
        response.status.should == 401
      end

      context 'with authenticated user' do
        before(:each) { set_current_user FactoryGirl.create(:user) }

        it 'should respond with OK' do
          get :index, format: :json, photo_id: @photo.id
          response.status.should == 200
        end

        it 'should respond hash of photo meta data' do
          get :index, format: :json, photo_id: @photo.id

          JSON(response.body).should == [
            {'name' => 'Meta1', 'value' => 'Value1'},
            {'name' => 'Meta2', 'value' => 'Value2'}
          ]
        end
      end
    end
  end
end
