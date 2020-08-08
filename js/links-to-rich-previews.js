const domainUrl = "https://via.giftmoji.com/";
const richPreviewTemplate = `
    <div class="rich-preview">  
        <div class="rich-preview-image">    
            <a href="https://sub.domain.com/link-one" target="_blank" class="rich">      
                <img src="https://sub.domain.com/image-for-link-one.png">    
            </a>  
        </div>  
        <div class="rich-preview-link">   
            <a href="https://sub.domain.com/link-one" target="_blank" class="rich">Page Title Goes Here</a>  
        </div>
    </div>
    `;

// Get link metadata and update links in DOM
async function updateLink(link) {
    $.ajax({
        type: 'GET',
        url: 'https://whatever-origin.herokuapp.com/get?url=' + encodeURIComponent(link) + '&callback=?',
        dataType: 'json',
        success: function (data) {
            htmlResponse = data.contents;
            let htmlDoc = $.parseHTML($.trim(htmlResponse));
            const title = $(htmlDoc).filter('meta[property="og:title"]').attr('content');
            const imageUrl = $(htmlDoc).filter('meta[property="og:image"]').attr('content');
            if(title && imageUrl){
                appendRichPreview(link, title, imageUrl);
            }
        }
    });
}

// Get all links of the page that are of a certain domain
function getPageLinks(url) {
    const links = $('a[href*="' + url + '"][href!="' + url + '"]:not(".rich")');
    return links;
}

// Append rich preview to html DOM
function appendRichPreview(link, title, imageUrl) {
    let richPreview =
        $(richPreviewTemplate)
            .find('div.rich-preview-image a.rich').attr('href', link).end()
            .find('a.rich img').attr('src', imageUrl).end()
            .find('div.rich-preview-link a').attr('href', link).text(title).end()
    $(link).replaceWith(richPreview);
}

$(document).ready(function () {
    // Currently the links are updated, if needed, every 2 seconds
    setInterval(function () {
        let links = getPageLinks(domainUrl);
        for (let i = 0; i < links.length; i++) {
            updateLink(links[i])
        }
    },2000);
    
});