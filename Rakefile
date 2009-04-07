require 'rake'

DIALOGS_ROOT          = File.expand_path(File.dirname(__FILE__))
DIALOGS_SRC_DIR       = File.join(DIALOGS_ROOT, 'src')
DIALOGS_DIST_DIR      = File.join(DIALOGS_ROOT, 'dist')
DIALOGS_TEST_DIR      = File.join(DIALOGS_ROOT, 'test')
DIALOGS_TEST_UNIT_DIR = File.join(DIALOGS_TEST_DIR, 'unit')
DIALOGS_TMP_DIR       = File.join(DIALOGS_TEST_UNIT_DIR, 'tmp')
DIALOGS_VERSION       = YAML.load(IO.read(File.join(DIALOGS_SRC_DIR, 'constants.yml')))['DIALOGS_VERSION']

$:.unshift File.join(DIALOGS_ROOT, 'vendor', 'sprockets', 'lib')

task :default => :dist

def sprocketize path, source, destination=source
  begin
    require 'sprockets'
  rescue LoadError
    puts "\nYou'll need Sprockets to build Dialogs. Just run:\n\n"
    puts "  $ git submodule init"
    puts "  $ git submodule update"
    puts "\nand you should be all set.\n\n"
  end
  
  secretary = Sprockets::Secretary.new(
    :root => File.join(DIALOGS_ROOT, path),
    :load_path => [DIALOGS_SRC_DIR],
    :source_files => [source]
  )
  
  secretary.concatenation.save_to(File.join(DIALOGS_DIST_DIR, destination))
end

desc "Builds the distribution."
task :dist do
  sprocketize('src', 'dialogs.js')
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