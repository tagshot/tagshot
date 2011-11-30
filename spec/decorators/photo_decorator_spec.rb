require 'spec_helper'

describe PhotoDecorator do
  before(:each) { ApplicationController.new.set_current_view_context }
  
  context 'as json' do
    before :all do
      @photo = Factory(:photo)
      @photo.tags += ['a', 'b', 'c']
      @photo.properties += {'Meta1' => 'Value1', 'Meta2' => 'Value2'}
      @json  = PhotoDecorator.decorate(@photo).as_json
    end
    
    it 'should contain valid id' do 
      @json[:id].should == @photo.id 
    end
    it 'should contain properties hash' do 
      @json[:properties].should be_a(Hash)
    end
    it 'should contain photos caption' do
      @json[:properties][:caption].should == @photo.caption
    end
    it 'should contain photos description' do
      @json[:properties][:description].should == @photo.description
    end
    it 'should contain photos rating' do
      @json[:properties][:rating].should == @photo.rating
    end
    it 'should contain photos location' do
      @json[:properties][:location].should == @photo.location
    end
    it 'should contain an array with tags' do
      @json[:tags].should =~ @photo.tags.names
    end
    it 'should contain a hash with meta data' do
      @json[:meta].should == @photo.properties.to_hash
    end
    it 'should contain a thumb url' do
      @json[:thumb].should == Rails.application.routes.url_helpers.thumb_url(@photo, :format => @photo.extname)
    end
    it 'should contain a image url' do
      @json[:image].should == Rails.application.routes.url_helpers.photo_url(@photo, :format => @photo.extname)
    end
  end
end
