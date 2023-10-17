odoo.define("youtube_api_anakut.s_youtube_videos", function(require) {
  const PublicWidget = require("web.public.widget");
  const wUtils = require("website.utils");
  const core = require("web.core");
  const QWeb = core.qweb;

  const SYoutubeVideos = PublicWidget.Widget.extend({
    selector: "#dynamic_snippet_youtube_videos",

    read_events: {
      "click .youtube_load_more_btn": "_loadMoreVideos",
    },

    willStart: function() {
      // biome-ignore lint/style/noArguments: <explanation>
      return this._super.apply(this, arguments).then(() => {
        this.container = this.$el.find(".container-youtube-videos");
        this.loadMoreBtn = this.$el.find(".youtube_load_more_btn");

        this.pageIndex = 0;

        this.max_results = this.$el.data("number_of_videos");
        if (this.max_results === undefined) {
          this.max_results = 10;
        }
        this.channel_id = this.$el.data("channel_id");
        if (this.channel_id === undefined) {
          return;
        }
        this.videos = [];
        return Promise.all([this._getVideos()]);
      });
    },

    start: function() {
      // Get attribute from this el
      this.channel_link = this.$el.data("youtube_channel_link");
      this.$el.find(".subscribe_btn").attr("href", this.channel_link);

      this._render();
    },

    _getVideos: async function() {
      return await fetch(`/api/youtube/${this.channel_id}/videos?max_results=${this.max_results}`).then(res => res.json()).then(data => {
        this.nextPageToken = data.nextPageToken;
        if (this.nextPageToken === undefined || this.nextPageToken === null || this.nextPageToken === "") {
          this.loadMoreBtn.attr("disabled", true);
        }
        this.videos = data.items;
      }).catch(err => {
        console.log(err);
      })
    },

    _render: function() {
      if (!this.videos) {
        if (!this.channel_id) {
          this.container.html("<p>Channel ID not found</p>");
        }
        return;
      }
      if (this.pageIndex === 0) {
        this.container.html("");
      }
      console.log(this.videos);
      this.container.append(QWeb.render("youtube_api_anakut.YoutubeIframes", {
        videos: this.videos.slice(this.pageIndex * this.max_results)
      }));
    },

    _loadMoreVideos: async function() {
      return await fetch(`/api/youtube/${this.channel_id}/videos?max_results=${this.max_results}&page_token=${this.nextPageToken}`).then(res => res.json()).then(data => {
        this.nextPageToken = data.nextPageToken;
        if (this.nextPageToken === undefined || this.nextPageToken === null || this.nextPageToken === "") {
          this.loadMoreBtn.attr("disabled", true);
        }
        this.videos = this.videos.concat(data.items);
        this.pageIndex++;
        this._render();
      }).catch(err => {
        console.log(err);
      })
    }
  });

  PublicWidget.registry.s_youtube_videos = SYoutubeVideos;

  return SYoutubeVideos;
});
