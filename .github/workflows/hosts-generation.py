def process_hosts_file(input_file, output_file):
    # Read the local file, remove whitespace, comments, and sort the lines
    with open(input_file, 'r') as file:
        lines = file.readlines()

    processed_lines = []
    for line in lines:
        # Remove whitespace and comments
        stripped_line = line.strip()
        if not stripped_line or stripped_line.startswith('#') or stripped_line.startswith('[AdBlock]') or stripped_line.startswith('10.10'):
            continue
        processed_lines.append(stripped_line)

    processed_lines.sort()

    # Add "127.0.0.1 " to the beginning of each line
    final_lines = ["127.0.0.1 " + line for line in processed_lines]

    # Write the processed lines to the output file
    with open(output_file, 'w') as file:
        file.write('\n'.join(final_lines))

if __name__ == "__main__":
    input_file = "PersianBlockerHosts.txt"
    output_file = "hosts"
    process_hosts_file(input_file, output_file)
    print(f"Processed hosts file saved as {output_file}")

