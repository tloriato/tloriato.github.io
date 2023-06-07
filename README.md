# tloriato.github.io

This is the source code for my [blog](https://tloriato.github.io). It's a
static website powered by [Jekyll](https://jekyllrb.com/) with site analytics
done via [plausible.io](https://plausible.io/tloriato.github.io) (private,
cookie-free and open source).

## Set-up

Make sure that you have [bundler](https://bundler.io/) and
[Ruby](https://www.ruby-lang.org/en/news/2019/12/25/ruby-2-7-0-released/) in
your system:

```shell
gem install bundler
```

Then, build the dependencies and call `jekyll serve`

```shell
git clone https://github.com/tloriato/tloriato.github.io.git 
cd tloriato.github.io/
bundle install
bundle exec jekyll serve --livereload
```

The page, by default, should be running at [localhost:4000](localhost:4000)

## Contribute

If you found some errors in spelling/grammar, mistakes in content and the like, then feel
free to fork this repository and [make a Pull Request!](https://help.github.com/articles/creating-a-pull-request/)

[![licensebuttons by](https://licensebuttons.net/l/by/3.0/88x31.png)](https://creativecommons.org/licenses/by/4.0)
