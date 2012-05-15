require 'spec_helper'

describe PhotoDecorator do
  before(:all) { ApplicationController.new.set_current_view_context }

  context 'as json' do
    before :all do
      @photo = FactoryGirl.create(:photo_with_tags)
      @json  = PhotoDecorator.decorate(@photo).as_json
    end

    it 'should contain valid id' do
      @json[:id].should == @photo.id
    end

    it 'should contain properties hash' do
      @json[:properties].should be_a(Hash)
    end

    it 'should contain readonly properties (meta) hash' do
      @json[:meta].should be_a(Hash)
    end

    it 'should contain an array with tags' do
      @json[:tags].should =~ @photo.tags.names
    end

    it 'should contain a thumb url' do
      @json[:thumb].should == Rails.application.routes.url_helpers.thumb_url(@photo, :format => @photo.extname)
    end

    it 'should contain a image url' do
      @json[:image].should == Rails.application.routes.url_helpers.photo_url(@photo, :format => @photo.extname)
    end
  end
end

