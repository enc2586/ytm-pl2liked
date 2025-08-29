(async function () {
  console.log("╔══════════════════════════════════════╗");
  console.log("║      YouTube Music Auto Liker        ║");
  console.log("╚══════════════════════════════════════╝");

  // Step 1: Disclaimer
  const disclaimerMessage =
    `⚠️ DISCLAIMER - PLEASE READ CAREFULLY ⚠️\n\n` +
    `This script is provided "AS IS" without warranty of any kind.\n\n` +
    `BY USING THIS SCRIPT, YOU ACKNOWLEDGE AND AGREE THAT:\n\n` +
    `1. You use this script at YOUR OWN RISK.\n` +
    `2. The author assumes NO LIABILITY for any damages, account suspensions, or other consequences.\n` +
    `3. This may violate YouTube's Terms of Service.\n` +
    `4. Your account may be temporarily or permanently suspended.\n` +
    `5. You are solely responsible for any actions taken using this script.\n\n` +
    `Do you understand and accept all risks?\n\n` +
    `Click OK to proceed or Cancel to abort.`;

  const acceptDisclaimer = confirm(disclaimerMessage);

  if (!acceptDisclaimer) {
    console.log("❌ Operation cancelled - Disclaimer not accepted.");
    return;
  }

  // Step 2: Load all songs in playlist
  console.log("\n📜 Loading all songs in playlist...");

  let previousHeight = 0;
  let noChangeCount = 0;
  const checkInterval = 500; // 0.5 seconds
  const maxNoChangeTime = 5000; // 5 seconds
  const scrollPadding = 1300;
  const maxNoChangeCount = maxNoChangeTime / checkInterval;

  // Scroll and load function
  async function loadAllSongs() {
    while (noChangeCount < maxNoChangeCount) {
      // Scroll to bottom minus 500px
      const scrollTarget = Math.max(
        0,
        document.documentElement.scrollHeight - scrollPadding
      );
      window.scrollTo(0, scrollTarget);

      // Wait 0.5 seconds
      await new Promise((resolve) => setTimeout(resolve, checkInterval));

      // Check current page height
      const currentHeight = document.documentElement.scrollHeight;

      if (currentHeight > previousHeight) {
        // Page loaded more content
        console.log(
          `  └─ Loading... Height: ${previousHeight} → ${currentHeight}`
        );
        previousHeight = currentHeight;
        noChangeCount = 0; // Reset counter
      } else {
        // No change
        noChangeCount++;
        if (noChangeCount % 4 === 0) {
          // Show status every 2 seconds
          console.log(
            `  └─ Waiting for more content... (${
              (noChangeCount * checkInterval) / 1000
            }s)`
          );
        }
      }
    }

    console.log("  └─ ✅ All songs loaded!\n");
  }

  await loadAllSongs();

  // Step 3: Find playlist elements and collect song information
  const playlistShelf = document.querySelector(
    "ytmusic-playlist-shelf-renderer #contents"
  );
  if (!playlistShelf) {
    console.error("❌ Playlist not found.");
    return;
  }

  const songs = playlistShelf.querySelectorAll(
    "ytmusic-responsive-list-item-renderer"
  );
  console.log(`📊 Found ${songs.length} songs in playlist.\n`);

  if (songs.length === 0) {
    console.error("❌ No songs found in playlist.");
    return;
  }

  // Get first and last song info
  function getSongInfo(song) {
    const links = song.querySelectorAll("a.yt-simple-endpoint");
    const songTitle = links[0]?.textContent?.trim() || "Unknown title";
    const artistName = links[1]?.textContent?.trim() || "Unknown artist";
    return `${artistName} - ${songTitle}`;
  }

  const firstSongInfo = getSongInfo(songs[0]);
  const lastSongInfo = getSongInfo(songs[songs.length - 1]);

  // Step 4: User selections - Order
  const orderMessage =
    `Found ${songs.length} songs in playlist!\n\n` +
    `First song: ${firstSongInfo}\n` +
    `Last song: ${lastSongInfo}\n\n` +
    `Choose processing order:\n` +
    `OK = Reverse order (bottom to top ↑)\n` +
    `Cancel = Normal order (top to bottom ↓)`;

  const reverse = confirm(orderMessage);
  const orderText = reverse
    ? "REVERSE (bottom to top)"
    : "NORMAL (top to bottom)";

  // Step 5: User selections - Delay
  const delayMessage =
    `Set delay between each like (in seconds):\n\n` +
    `⚠️ WARNING: Too short delays may trigger rate limits and result in YouTube suspension.\n` +
    `Recommended: 10-15 seconds for large playlists\n` +
    `Minimum recommended: 5 seconds\n\n` +
    `Default: 10 seconds`;

  const userDelayInput = prompt(delayMessage, "10");

  if (userDelayInput === null) {
    console.log("❌ Operation cancelled by user.");
    return;
  }

  const delaySeconds = Math.max(1, parseInt(userDelayInput) || 10);
  const waitTime = delaySeconds * 1000;

  // Step 6: Final confirmation with settings
  const finalConfirmMessage =
    `⚠️ FINAL CONFIRMATION ⚠️\n\n` +
    `Settings:\n` +
    `• Songs to process: ${songs.length}\n` +
    `• Order: ${orderText}\n` +
    `• Delay: ${delaySeconds} seconds\n\n` +
    `Ready to start auto-liking process?\n\n` +
    `Click OK to proceed or Cancel to abort.`;

  const startProcess = confirm(finalConfirmMessage);

  if (!startProcess) {
    console.log("❌ Operation cancelled by user.");
    return;
  }

  console.log(`\n📍 Settings confirmed:`);
  console.log(`  • User accepted all terms and risks`);
  console.log(`  • Order: ${orderText}`);
  console.log(`  • Delay: ${delaySeconds} seconds`);
  console.log("─".repeat(50));

  // Step 7: Start processing
  const songsArray = reverse ? Array.from(songs).reverse() : Array.from(songs);

  let processedCount = 0;
  let likedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Helper function to create status bar
  function createStatusBar(
    current,
    total,
    liked,
    skipped,
    errors,
    remainingTime = 0
  ) {
    const percentage = Math.round((current / total) * 100);
    const barLength = 30;
    const filledLength = Math.round((percentage / 100) * barLength);
    const bar = "█".repeat(filledLength) + "░".repeat(barLength - filledLength);

    // Calculate ETA
    let etaText = "";
    if (remainingTime > 0) {
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      etaText = ` | ETA: ${minutes}m ${seconds}s`;
    }

    return (
      `\n╔════════════════════════════════════════════════╗\n` +
      `║ [${bar}] ${percentage}%${etaText}\n` +
      `║ 🔁 Processed: ${current}/${total} | ✅ Liked: ${liked}\n` +
      `║ ⏭️ Skip: ${skipped} | ❌ Err: ${errors}\n` +
      `╚════════════════════════════════════════════════╝`
    );
  }

  // Scroll to top before starting
  window.scrollTo(0, 0);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  console.log("\n🎵 Starting auto-like process...\n");

  for (let i = 0; i < songsArray.length; i++) {
    const song = songsArray[i];
    processedCount++;

    try {
      const links = song.querySelectorAll("a.yt-simple-endpoint");
      const songTitle = links[0]?.textContent?.trim() || "Unknown title";
      const artistName = links[1]?.textContent?.trim() || "Unknown artist";

      const likeButtonRenderer = song.querySelector(
        "ytmusic-like-button-renderer"
      );
      const likeButton = likeButtonRenderer?.querySelector(
        "#button-shape-like button"
      );

      console.log(
        `\n[${processedCount}/${songs.length}] Processing: ${artistName} - ${songTitle}`
      );

      if (!likeButton) {
        console.log(`  └─ ❌ Like button not found`);
        errorCount++;
        const remainingTime = (songs.length - processedCount) * delaySeconds;
        console.log(
          createStatusBar(
            processedCount,
            songs.length,
            likedCount,
            skippedCount,
            errorCount,
            remainingTime
          )
        );
        continue;
      }

      const isLiked = likeButton.getAttribute("aria-pressed") === "true";
      console.log(`  └─ Status: ${isLiked ? "Already liked ✓" : "Not liked"}`);

      if (!isLiked) {
        // Scroll to song
        song.scrollIntoView({ behavior: "smooth", block: "center" });
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Click like button
        likeButton.click();
        likedCount++;
        console.log(`  └─ ✅ Liked successfully!`);

        // Wait if not last song
        if (i < songsArray.length - 1) {
          const remainingSongs = songsArray.length - processedCount;
          const estimatedTime = remainingSongs * delaySeconds;
          const minutes = Math.floor(estimatedTime / 60);
          const seconds = estimatedTime % 60;
          console.log(
            `  └─ ⏱️ ETA: ${minutes}m ${seconds}s (${remainingSongs} songs remaining)`
          );
          console.log(`  └─ ⏸️ Waiting ${delaySeconds} seconds...`);

          // Show status bar with ETA
          console.log(
            createStatusBar(
              processedCount,
              songs.length,
              likedCount,
              skippedCount,
              errorCount,
              estimatedTime
            )
          );

          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          // Last song - show final status bar
          console.log(
            createStatusBar(
              processedCount,
              songs.length,
              likedCount,
              skippedCount,
              errorCount,
              0
            )
          );
        }
      } else {
        skippedCount++;
        console.log(`  └─ ⏭️ Skipped (already liked)`);

        // Show status bar with ETA
        const remainingTime =
          (songsArray.length - processedCount) * delaySeconds;
        console.log(
          createStatusBar(
            processedCount,
            songs.length,
            likedCount,
            skippedCount,
            errorCount,
            remainingTime
          )
        );
      }
    } catch (error) {
      errorCount++;
      console.error(`  └─ ❌ Error: ${error.message}`);
      const remainingTime = (songsArray.length - processedCount) * delaySeconds;
      console.log(
        createStatusBar(
          processedCount,
          songs.length,
          likedCount,
          skippedCount,
          errorCount,
          remainingTime
        )
      );
    }
  }

  // Final summary
  const summary =
    `\n╔══════════════════════════════════════════════╗\n` +
    `║              COMPLETED! 🎉                    ║\n` +
    `╠══════════════════════════════════════════════╣\n` +
    `║ Total processed: ${processedCount
      .toString()
      .padEnd(5)} songs              ║\n` +
    `║ Newly liked:     ${likedCount
      .toString()
      .padEnd(5)} songs              ║\n` +
    `║ Already liked:   ${skippedCount
      .toString()
      .padEnd(5)} songs              ║\n` +
    `║ Errors:          ${errorCount
      .toString()
      .padEnd(5)} songs              ║\n` +
    `╚══════════════════════════════════════════════╝`;

  console.log(summary);

  // Completion alert
  alert(
    `✅ Auto Liker Completed!\n\n` +
      `Total processed: ${processedCount} songs\n` +
      `Newly liked: ${likedCount} songs\n` +
      `Already liked: ${skippedCount} songs\n` +
      `Errors: ${errorCount} songs\n\n` +
      `Thank you for using YouTube Music Auto Liker!`
  );
})();
