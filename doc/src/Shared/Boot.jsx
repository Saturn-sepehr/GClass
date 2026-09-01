import React from 'react'

export default function Boot() {
  return (
    <div className='fixed h-screen w-screen boot-up boot-time-4'>
        <div
          className='crt-screen  fixed inset-0 -z-20 bg-slate-900'
          aria-hidden='true'
        />
     

      <div className='relative font-mono text-cyan-200 w-screen h-screen text-xs leading-4 whitespace-pre-wrap max-h-[70vh] overflow-hidden p-4'>
        <p className='typewriter time-3.5 w-screen h-screen'>{`[  OK  ] Starting GClass Boot Sequence - GNU/GClass
[  OK  ] Listening on Journal Socket (/dev/log).
[  OK  ] Listening on Journal Socket.
[  OK  ] Mounted Huge Pages File System.
[  OK  ] Mounted POSIX Message Queue File System.
[  OK  ] Mounted Kernel Debug File System.
[  OK  ] Mounted Kernel Trace File System.
[  OK  ] Finished Availability of block devices.
[  OK  ] Starting Create List of Static Device Nodes...
[  OK  ] Finished Create List of Static Device Nodes.
[  OK  ] Starting Load Kernel Module configfs...
[  OK  ] Starting Load Kernel Module drm...
[  OK  ] Starting Load Kernel Module fuse...
[  OK  ] Finished Load Kernel Module configfs.
[  OK  ] Finished Load Kernel Module drm.
[  OK  ] Finished Load Kernel Module fuse.
[  OK  ] Mounted FUSE Control File System.
[  OK  ] Mounted Kernel Configuration File System.
[  OK  ] Started Journal Service.
[  OK  ] Started Remount Root and Kernel File Systems.
[  OK  ] Started Create Static Device Nodes in /dev gracefully.
[  OK  ] Starting Coldplug All udev Devices...
[  OK  ] Started Coldplug All udev Devices.
[  OK  ] Starting Helper to synchronize boot up for ifupdown...
[  OK  ] Started Helper to synchronize boot up for ifupdown.
[  OK  ] Started GSAP Engine v3.15.0 (TextPlugin, ScrollTrigger, SplitText, DrawSVG, MotionPath, ScrambleText, Flip).
[  OK  ] Mounted Animation Registry (spawn-up/down/left/right, spawn-fade/blur, expand-*, typewriter, scramble, count, clip-reveal, curtain, draw, draw-split, shake/bounce/bell/pulse/radiate/float/marquee).
[  OK  ] Started GClass Animation System - Tailwind-style utility layer.
[  OK  ] Starting Raise network interfaces...
[  OK  ] Started Raise network interfaces.
[  OK  ] Reached target Network.
[  OK  ] Reached target Network is Online.
[  OK  ] Starting LSB: exim4...
[  OK  ] Started LSB: exim4.
[  OK  ] Starting System Logging Service...
[  OK  ] Started System Logging Service.
[  OK  ] Starting D-Bus System Message Bus...
[  OK  ] Started D-Bus System Message Bus.
[  OK  ] Starting User Login Management...
[  OK  ] Started User Login Management.
[  OK  ] Started WPA supplicant.
[  OK  ] Reached target System Initialization.
[  OK  ] Started Daily apt download activities.
[  OK  ] Started Daily apt upgrade and clean activities.
[  OK  ] Started Discard unused blocks once a week.
[  OK  ] Listening on D-Bus System Message Bus Socket.
[  OK  ] Reached target Socket Units.
[  OK  ] Reached target Basic System.
[  OK  ] Started Regular background program processing daemon.
[  OK  ] Started Save/Restore Sound Card State.
[  OK  ] Started CUPS Scheduler.
[  OK  ] Reached target Printer.
[  OK  ] Started Dispatcher daemon for systemd-networkd.
[  OK  ] Started Boot Animation (boot-up boot-time-4 boot-end-spawn-blur).
[  OK  ] Listening on boot-up (any .boot-up in DOM).
[  OK  ] Reached target Graphical Interface.
[  OK  ] Started GClass Doc Site (Next.js 15 - StrictMode).
[  OK  ] Listening on GClass Boot Complete.`}</p>
      </div>


       
          <div className='bg-slate-900 opacity-50 mix-blend-color pointer-events-none fixed inset-0 z-50' aria-hidden='true' />
          <div className='crt-overlay pointer-events-none fixed inset-0 z-50' aria-hidden='true' />

          <div
            className='crt-vignette pointer-events-none fixed inset-0 z-50 overflow-hidden'
            aria-hidden='true'
          />
    </div>
  )
}
