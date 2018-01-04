/******************************************************************************
 * A basic system daemon that writes to a log file
 * per http://www.thegeekstuff.com/2012/02/c-daemon-process/
 * Author: Patrick Kennedy
 * Started: October 19, 2017
 * NOTE: invoke the daemon with sudo if writing to root dir / (line 50).
 * Current implementation of writing to home dir may not be portable.
 * To kill the process, `sudo kill <process id>`.
 * Obtain active daemon process id from console output or
 * on macOS with the Activity Monitor (process named "daemon")
 ******************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <string.h>
#include <time.h>

int main(int argc, char* argv[]) {
  FILE *fp = NULL;
  pid_t process_id = 0;
  pid_t sid = 0;

  // Create child process
  process_id = fork();

  // Indication if fork() fails
  if (process_id < 0) {
    puts("The fork() failed");
    // Return failue in exit status
    exit(1);
  }

  // Parent process: need to kill it
  if (process_id > 0) {
    printf("process_id of child process: %d\n", process_id);
    // Return success in exit status
    exit(0);
  }

  // unmask the file mode
  umask(0);
  // set a new session
  sid = setsid();
  if (sid < 0) {
    // Return session failure
    exit(1);
  }

  // // Change the current working directory to root - requires sudo
  // chdir("/");
  // Change current working directory to home directory
  chdir(getenv("HOME"));
  // Close std, stdout and stderr
  close(STDIN_FILENO);
  close(STDOUT_FILENO);
  close(STDERR_FILENO);
  // Open a log file in write mode
  fp = fopen("daemon_log.txt", "w+");

  // // Print the process_id to the log file
  // // Not sure why this prints the process_id as 0, but prolly a way to extract the id for printing
  // fprintf(fp, "Exorcise the active daemon with `$ kill %d`\n", process_id);

  while(1) {
    // Let the process sleep for some time to not block context switches
    sleep(1);
    // Record Unix time
    time_t the_time = time(NULL);
    // printf("The current UNIX time: %ld\n", the_time);
    struct tm * ptr_time;
    time(&the_time);
    // convert Unix time to local date and time
    ptr_time = localtime(&the_time);
    // printf ("Current local date and time: %s\n", asctime(ptr_time));
    // Log the local time to the log file (seems like asctime adds a newline)
    fprintf(fp, "Logged at: %s", asctime(ptr_time));
    fflush(fp);
    // Implement and call some function which does the core work for this daemon
  }
  fclose(fp);
  return(0);
}
