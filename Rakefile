require 'rake'
require 'rake/packagetask'
require 'yaml'

module Protototo
  ROOT_DIR      = File.expand_path(File.dirname(__FILE__))
  SRC_DIR       = File.join(ROOT_DIR, 'src')
  DIST_DIR      = File.join(ROOT_DIR, 'dist')
  DOC_DIR       = File.join(ROOT_DIR, 'doc')
  TEMPLATES_DIR = File.join(ROOT_DIR, 'templates')
  PKG_DIR       = File.join(ROOT_DIR, 'pkg')
  TEST_DIR      = File.join(ROOT_DIR, 'test')
  TEST_UNIT_DIR = File.join(TEST_DIR, 'unit')
  TMP_DIR       = File.join(TEST_UNIT_DIR, 'tmp')
  VERSION       = YAML.load(IO.read(File.join(ROOT_DIR, 'config', 'constants.yml')))['PROTOTOTO_VERSION']
  
  def self.sprocketize(path, source, destination = nil, strip_comments = true, asset_root = nil)
    require_sprockets
    setup = {
      :root           => ROOT_DIR,
      :load_path      => ['config'],
      :source_files   => [File.join(path, source)],
      :strip_comments => strip_comments
    }
    setup[:asset_root] = asset_root if asset_root
    secretary = Sprockets::Secretary.new(setup)
    
    destination = File.join(DIST_DIR, source) unless destination
    secretary.concatenation.save_to(destination)
    secretary.install_assets if asset_root
  end
  
  def self.build_doc_for(file)
    mkdir_p TMP_DIR
    temp_path = File.join(TMP_DIR, "protototo.temp.js")
    sprocketize('src', file, temp_path, false)
    rm_rf DOC_DIR
    
    PDoc::Runner.new(temp_path, {
      :output    => DOC_DIR,
      :templates => File.join(TEMPLATES_DIR, "html"),
      :index_page => 'README.markdown'
    }).run
    
#    rm_rf temp_path
  end
  
  def self.require_sprockets
    require_submodule('Sprockets', 'sprockets')
  end
  
  def self.require_pdoc
    require_submodule('PDoc', 'pdoc')
  end
  
  def self.require_unittest_js
    require_submodule('UnittestJS', 'unittest_js')
  end
  
  def self.require_submodule(name, path)
    begin
      require path
    rescue LoadError => e
      missing_file = e.message.sub('no such file to load -- ', '')
      if missing_file == path
        puts "\nIt looks like you're missing #{name}. Just run:\n\n"
        puts "  $ git submodule init"
        puts "  $ git submodule update vendor/#{path}"
        puts "\nand you should be all set.\n\n"
      else
        puts "\nIt looks like #{name} is missing the '#{missing_file}' gem. Just run:\n\n"
        puts "  $ gem install #{missing_file}"
        puts "\nand you should be all set.\n\n"
      end
      exit
    end
  end
end

%w[sprockets pdoc unittest_js].each do |name|
  $:.unshift File.join(Protototo::ROOT_DIR, 'vendor', name, 'lib')
end

task :default => [:dist, :package, :clean_package_source]

desc "Print the protototo version"
task :version do
  puts "protototo version #{Protototo::VERSION}"
end

desc "Clean the distribution folder"
task :clean do
  Dir.glob(File.join(Protototo::DIST_DIR, '*')) do |file|
    FileUtils.rm_rf file
  end
end

desc "Builds the distribution."
task :dist => :clean do
  Protototo.sprocketize('src', 'protototo.js', nil, true, 'dist')
end

namespace :doc do
  desc "Builds the documentation."
  task :build => [:require] do
    Protototo.build_doc_for(ENV['SECTION'] ? "#{ENV['SECTION']}.js" : 'protototo.js')
  end  
  
  task :require do
    Protototo.require_pdoc
  end
end

task :doc => ['doc:build']

Rake::PackageTask.new('protototo', "#{Protototo::VERSION}") do |package|
  package.need_tar_gz = true
  package.package_dir = Protototo::PKG_DIR
  package.package_files.include(
    'CHANGELOG',
    'README.rdoc',
    'dist/**/*',
    'examples/**/*',
    'src/**/*',
    'test/unit/*.js',
    'test/unit/fixtures/**/*',
    'test/unit/templates/**/*'
  )
end

task :clean_package_source do
  rm_rf File.join(Protototo::PKG_DIR, "protototo-#{Protototo::VERSION}")
end

task :test => ['test:build', 'test:run']
namespace :test do
  desc 'Runs all the JavaScript unit tests and collects the results'
  task :run => [:require] do
    testcases        = ENV['TESTCASES']
    browsers_to_test = ENV['BROWSERS'] && ENV['BROWSERS'].split(',')
    tests_to_run     = ENV['TESTS'] && ENV['TESTS'].split(',')
    runner           = UnittestJS::WEBrickRunner::Runner.new(:test_dir => DIALOGS_TMP_DIR)

    Dir[File.join(Protototo::TMP_DIR, '*_test.html')].each do |file|
      file = File.basename(file)
      test = file.sub('_test.html', '')
      unless tests_to_run && !tests_to_run.include?(test)
        runner.add_test(file, testcases)
      end
    end
    
    UnittestJS::Browser::SUPPORTED.each do |browser|
      unless browsers_to_test && !browsers_to_test.include?(browser)
        runner.add_browser(browser.to_sym)
      end
    end
    
    trap('INT') { runner.teardown; exit }
    runner.run
  end
  
  task :server => [:build] do
    runner = UnittestJS::WEBrickRunner::Runner.new(:test_dir => Protototo::TMP_DIR)
    trap('INT') { runner.teardown; exit }
    runner.setup
  end
  
  task :build => [:clean, :dist] do
    builder = UnittestJS::Builder::SuiteBuilder.new({
      :input_dir  => Protototo::TEST_UNIT_DIR,
      :assets_dir => Protototo::DIST_DIR
    })
    selected_tests = (ENV['TESTS'] || '').split(',')
    builder.collect(*selected_tests)
    builder.render
  end
  
  task :clean => [:require] do
    UnittestJS::Builder.empty_dir!(Protototo::TMP_DIR)
  end
  
  task :require do
    Protototo.require_unittest_js
  end
end
