require 'rake'
require 'rake/packagetask'
require 'yaml'

DIALOGS_ROOT          = File.expand_path(File.dirname(__FILE__))
DIALOGS_SRC_DIR       = File.join(DIALOGS_ROOT, 'src')
DIALOGS_DIST_DIR      = File.join(DIALOGS_ROOT, 'dist')
DIALOGS_PKG_DIR       = File.join(DIALOGS_ROOT, 'pkg')
DIALOGS_TEST_DIR      = File.join(DIALOGS_ROOT, 'test')
DIALOGS_TEST_UNIT_DIR = File.join(DIALOGS_TEST_DIR, 'unit')
DIALOGS_TMP_DIR       = File.join(DIALOGS_TEST_UNIT_DIR, 'tmp')
DIALOGS_VERSION       = YAML.load(IO.read(File.join(DIALOGS_ROOT, 'config', 'constants.yml')))['PROTOTOTO_VERSION']

$:.unshift File.join(DIALOGS_ROOT, 'vendor', 'sprockets', 'lib')

desc "Print the protototo version"
task :version do
  puts "protototo version #{DIALOGS_VERSION}"
end

task :default => [:dist, :package, :clean_package_source]

desc "Clean the distribution folder"
task :clean do
  Dir.glob(File.join(DIALOGS_DIST_DIR, '*')) do |file|
    FileUtils.rm_rf(file)
  end
end

desc "Builds the distribution."
task :dist => :clean do
  begin
    require 'sprockets'
  rescue LoadError
    puts "\nYou'll need Sprockets to build Dialogs. Just run:\n\n"
    puts "  $ git submodule init"
    puts "  $ git submodule update"
    puts "\nand you should be all set.\n\n"
  end
  
  secretary = Sprockets::Secretary.new(
    :root => DIALOGS_ROOT,
    :source_files => [File.join('src', 'protototo.js')],
    :load_path => ['config'],
    :asset_root => 'dist',
    :relative_require_only=>true
  )
  
  secretary.concatenation.save_to(File.join(DIALOGS_DIST_DIR, 'protototo.js'))
  secretary.install_assets
end

Rake::PackageTask.new('protototo', "v#{DIALOGS_VERSION}") do |package|
  package.need_tar_gz = true
  package.package_dir = DIALOGS_PKG_DIR
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
  rm_rf File.join(DIALOGS_PKG_DIR, "protototo-v#{DIALOGS_VERSION}")
end

task :test => ['test:build', 'test:run']
namespace :test do
  desc 'Runs all the JavaScript unit tests and collects the results'
  task :run => [:require] do
    testcases        = ENV['TESTCASES']
    browsers_to_test = ENV['BROWSERS'] && ENV['BROWSERS'].split(',')
    tests_to_run     = ENV['TESTS'] && ENV['TESTS'].split(',')
    runner           = UnittestJS::WEBrickRunner::Runner.new(:test_dir => DIALOGS_TMP_DIR)

    Dir[File.join(DIALOGS_TMP_DIR, '*_test.html')].each do |file|
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
    runner = UnittestJS::WEBrickRunner::Runner.new(:test_dir => DIALOGS_TMP_DIR)
    trap('INT') { runner.teardown; exit }
    runner.setup
  end
  
  task :build => [:clean, :dist] do
    builder = UnittestJS::Builder::SuiteBuilder.new({
      :input_dir  => DIALOGS_TEST_UNIT_DIR,
      :assets_dir => DIALOGS_DIST_DIR
    })
    selected_tests = (ENV['TESTS'] || '').split(',')
    builder.collect(*selected_tests)
    builder.render
  end
  
  task :clean => [:require] do
    UnittestJS::Builder.empty_dir!(DIALOGS_TMP_DIR)
  end
  
  task :require do
    lib = 'vendor/unittest_js/lib/unittest_js'
    unless File.exists?(lib)
      puts "\nYou'll need UnittestJS to run the tests. Just run:\n\n"
      puts "  $ git submodule init"
      puts "  $ git submodule update"
      puts "\nand you should be all set.\n\n"
    end
    require lib
  end
end
