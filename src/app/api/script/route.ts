import { NextRequest, NextResponse } from "next/server";
import { minify } from "terser";
import dbConnect from "@/lib/database";
import { Counter } from "@/models/Counter";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const counterId = searchParams.get("id");
    if (!counterId) {
      return new NextResponse("// Error: Counter ID not specified", {
        status: 400,
        headers: { "Content-Type": "application/javascript; charset=utf-8" },
      });
    }

    const counter = await Counter.findOne({
      counterId,
      isActive: true,
    });
    if (!counter) {
      return new NextResponse("// Error: Counter not found", {
        status: 404,
        headers: { "Content-Type": "application/javascript; charset=utf-8" },
      });
    }
    const trackingScript = `(function() {
  'use strict';

  var counterId = '${counterId}';
  var apiUrl = '${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}';
  var sessionId = localStorage.getItem('analytics_session_' + counterId);

  if (!sessionId) {
    sessionId = Math.random().toString(36).substr(2, 12);
    localStorage.setItem('analytics_session_' + counterId, sessionId);
  }

  function sendData(endpoint, data) {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(apiUrl + endpoint, JSON.stringify(data));
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('POST', apiUrl + endpoint, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(data));
    }
  }

  function trackPageView() {
    sendData('/api/track/pageview', {
      counterId: counterId,
      sessionId: sessionId,
      url: location.href,
      referrer: document.referrer
    });
  }

  function trackGoal(goalName, goalValue, metadata) {
    sendData('/api/track/goal', {
      counterId: counterId,
      sessionId: sessionId,
      goalName: goalName,
      goalValue: goalValue,
      metadata: metadata
    });
  }

  trackPageView();

  var originalPushState = history.pushState;
  var originalReplaceState = history.replaceState;

  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(trackPageView, 0);
  };

  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(trackPageView, 0);
  };

  window.addEventListener('popstate', trackPageView);

  window.analytics = window.analytics || {};
  window.analytics.goal = trackGoal;
  window.analytics.track = trackPageView;
})();`;

    let finalScript = trackingScript;

    try {
      const minifyResult = await minify(trackingScript, {
        compress: true,
        mangle: true,
        format: {
          comments: false,
        },
      });

      if (minifyResult.code) {
        finalScript = minifyResult.code;
      }
    } catch (minifyError) {
      console.warn("Script minification failed, using original:", minifyError);
    }
    return new NextResponse(finalScript, {
      headers: {
        "Content-Type": "application/javascript; charset=utf-8",
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
        ETag: `"${Buffer.from(finalScript).toString("base64").slice(0, 16)}"`,
      },
    });
  } catch (error) {
    console.error("Script generation error:", error);
    return new NextResponse("// Server error", {
      status: 500,
      headers: { "Content-Type": "application/javascript; charset=utf-8" },
    });
  }
}
