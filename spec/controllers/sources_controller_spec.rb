require 'spec_helper'

describe SourcesController do
  describe "GET index" do
    context "as JSON" do
      it 'should require authentication' do
        get :index, format: :json
        response.status.should == 401
      end

      context 'with authenticated user' do
        before(:each) { set_current_user FactoryGirl.create(:user) }

        it 'should respond with OK' do
          get :index, format: :json
          response.status.should == 200
        end

        it 'should respond a list photo sources' do
      	  3.times { FactoryGirl.create(:source) }
          get :index, format: :json

          json = JSON(response.body)
          json.length.should == 3
          json.each do |source|
            source.include?('id').should   == true
            source.include?('name').should == true
            source.include?('path').should == true
          end
        end
      end
    end
  end
end
