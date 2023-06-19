using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace backend.Entities
{
    public partial class DBContext : DbContext
    {
        public DBContext()
        {
        }

        public DBContext(DbContextOptions<DBContext> options)
            : base(options)
        {
        }

        public virtual DbSet<User> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(ConfigureUser);

            modelBuilder.Entity<Actkey>(entity =>
            {
                entity.ToTable("tbl_actkeys");
                entity.Property(e => e.id).HasColumnType("int(11)");
                entity.Property(e => e.userid)
                    .IsRequired();
                entity.Property(e => e.actkey)
                    .IsRequired()
                    .HasMaxLength(45)
                    .IsUnicode(false);
                entity.Property(e => e.title)
                    .IsRequired()
                    .HasMaxLength(45)
                    .IsUnicode(false);
                entity.Property(e => e.status)
                    .IsRequired();
            });

            OnModelCreatingPartial(modelBuilder);
        }

        private void ConfigureUser(EntityTypeBuilder<User> builder)
        {
            builder.ToTable("tbl_users");
            builder.Property(e => e.id).HasColumnType("int(11)");
            builder.Property(e => e.email)
                .IsRequired()
                .HasMaxLength(45)
                .IsUnicode(false);
            builder.Property(e => e.password)
                .IsRequired()
                .HasMaxLength(45)
                .IsUnicode(false);
            builder.Property(e => e.cusid)
                .IsRequired()
                .HasMaxLength(45)
                .IsUnicode(false);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
