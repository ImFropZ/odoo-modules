odoo.define("youtube_api_anakut.s_youtube_videos", function(require) {
  const PublicWidget = require("web.public.widget");
  const wUtils = require("website.utils");
  const core = require("web.core");
  const QWeb = core.qweb;

  const SYoutubeVideos = PublicWidget.Widget.extend({
    selector: "#dynamic_snippet_youtube_videos",

    willStart: function() {
      // biome-ignore lint/style/noArguments: <explanation>
      return this._super.apply(this, arguments).then(() => {
        this.max_results = this.$el.data("max_results");
        this.channel_id = this.$el.data("channel_id");
        this.videos = [];
        return Promise.all([this._getVideos()]);
      });
    },

    start: function() {
      // Get attribute from this el
      this.channel_link = this.$el.data("youtube_channel_link");

      this.$el.closest(".subscribe_btn").attr("href", this.channel_link);

      this._render();
    },

    _getVideos: async function() {
      return await fetch(`/api/youtube/${this.channel_id}/videos` + this.max_results ? `?max_results=${this.max_results}` : "").then(res => res.json()).then(data => {
        this.nextPageToken = data.nextPageToken;
        this.videos = data.items;
      })
    },

    _render: function() {
      $("#dynamic_snippet_youtube_videos .container-youtube-videos").html(QWeb.render("youtube_api_anakut.YoutubeIframes", {
        videos: this.videos
      }));
    }
  });

  PublicWidget.registry.s_youtube_videos = SYoutubeVideos;

  return SYoutubeVideos;
});
