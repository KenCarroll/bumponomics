# 16. Media Embedding Demonstration

This is a sandbox page designed specifically to test the high-fidelity UI wrappers for native HTML5 audio, video, custom imaging, and automated YouTube ID parsing within the VitePress V1 architecture.

## 1. High Resolution Images

The `<BumpsImage>` component overrides the rigid defaults of standard Markdown images, granting you exact control over responsive aspect-ratio letterboxing and dynamic subtitle rendering.

<BumpsImage src="/images/bumps.svg" aspect="2/1" width="60%" caption="The official ecosystem taxonomy vector badge with a forced 2:1 aspect box." />

## 2. YouTube Algorithms

The custom `<YouTube>` component accepts raw IDs or full `youtu.be` share links, instantly validating the URL format and mathematically calculating the exact `16:9` intrinsic aspect ratio so your mobile layouts remain structurally immune to layout shift.

<YouTube src="https://youtu.be/dQw4w9WgXcQ" />

## 3. High Fidelity Audio

The `<BumpsAudio>` element standardizes the raw browser controls. It wraps the native player inside a premium glass-morphic padded block that leverages your existing CSS properties to conform permanently to your Light/Dark aesthetic modes.

<BumpsAudio src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" width="80%" caption="Open-source atmospheric audio synthesis (SoundHelix)" />

## 4. Native HTML5 Video

For instances where uploading to an external distribution layer isn't preferred, the `<BumpsVideo>` wrapper lets you stream raw `.mp4` payloads directly from your repository with pristine borders!

<BumpsVideo src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" aspect="16/9" width="100%" caption="External MP4 Stream Validation (Big Buck Bunny Open-Source Project)" />
