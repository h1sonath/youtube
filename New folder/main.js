let pageToken = '';
let isLoadingMore = false;
let getVideoTimeout;

$(document).ready(function () {
    $('#search').on('submit', function (event) {
        event.preventDefault();
        const keyword = $("#keyword").val();
        getVideoItem(keyword);
        //xoa tim kiem
        $('#result-list').empty();
        
        $(window).on('scroll', function () {
            if ($(document).height() - ($(window).height() + $(window).scrollTop()) < 1000) {
                const keyword = $('#keyword').val();
                if (!isLoadingMore && pageToken !== '') {
                    isLoadingMore = true;
                    getVideoItem(keyword);
                }
            }
        });

        if (getVideoTimeout) clearTimeout(getVideoTimeout);
        getVideoTimeout = setTimeout(function () {
            getVideoItem(keyword);
        }, 1000);
    });
});

function getVideoItem(keyword) {
    $.ajax({
        url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${keyword}&type=video&key=AIzaSyA9gQZ-oYomFypZN7PsupZJtOfQqA6Q3qw&pageToken=${pageToken}`,
        type: "GET",
        success: function (response) {
            let videoListItem = response.items.map(function (videoItem) {
                return `
                            <a class="result col-md-12" href="https://www.youtube.com/watch?v=${videoItem.id.videoId}?autoplay=true" target="_blank">
                                  <img src="${videoItem.snippet.thumbnails.high.url}" alt="">
                                   <div class="video_info">
                                   <p class="description">${videoItem.snippet.description}</p>
                                      <span>View >></span>
                                    </div>
                              </a>
                          `;
            });

            $('#result-list').append(videoListItem);
            if (response.nextPageToken) pageToken = response.nextPageToken;
            isLoadingMore = false;
            if (response.items.length == 0 || !response.nextPageToken) {
                pageToken = '';
                $('#result-list').append('<h2>Hết rồi!</h2>');
            }
        }
    });
}


